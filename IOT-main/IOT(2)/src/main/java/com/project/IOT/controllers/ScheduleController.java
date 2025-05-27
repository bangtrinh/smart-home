package com.project.IOT.controllers;

import com.project.IOT.DTOS.ScheduleDTO;
import com.project.IOT.services.ScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    public ResponseEntity<ScheduleDTO> createSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        ScheduleDTO dto = scheduleService.createSchedule(scheduleDTO);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDTO> getById(@PathVariable Long id) {
        ScheduleDTO schedule = scheduleService.findById(id);
        if (schedule == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(schedule);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleDTO> update(@PathVariable Long id, @RequestBody ScheduleDTO scheduleDTO) {
        scheduleDTO.setId(id);
        ScheduleDTO updated = scheduleService.update(scheduleDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.cancelSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
